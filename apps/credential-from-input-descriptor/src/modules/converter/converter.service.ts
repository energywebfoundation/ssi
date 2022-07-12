import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InputDesciptorToCredentialDto } from './dtos';
import jsf, { Schema } from 'json-schema-faker';
import { JsonValue } from 'type-fest';

@Injectable()
export class ConverterService {
  private readonly logger = new Logger(ConverterService.name, { timestamp: true });

  public async convertInputDescriptorToCredential(
    inputDesciptorToCredentialDto: InputDesciptorToCredentialDto
  ): Promise<unknown> {
    let intermediateResults: { path: string; result: JsonValue }[];

    try {
      intermediateResults = await Promise.all(
        inputDesciptorToCredentialDto.constraints.fields.map(async (field) =>
          ConverterService.convertField(field)
        )
      );
    } catch (err) {
      if (err.message.match('Error while resolving schema')) {
        throw new BadRequestException(err.message);
      } else {
        throw err;
      }
    }

    return intermediateResults.reduce((acc, resultItem) => {
      const path: string = resultItem.path;

      this.logger.debug(`processing "${path}"`);

      if (!ConverterService.pathIsValid(path)) {
        this.logger.warn(`invalid path: ${path}`);
        throw new BadRequestException(`invalid path: ${path}`);
      }

      const key = path.split('.')[1];

      acc[key] = resultItem.result;

      return acc;
    }, {});
  }

  private static async convertField(field: { path: string; filter: Schema }): Promise<{
    path: string;
    result: JsonValue;
  }> {
    return {
      path: field.path,
      result: await jsf.resolve(field.filter)
    };
  }

  private static pathIsValid(path: string): boolean {
    const elements = path.split('.');
    if (elements.length !== 2) {
      return false;
    }

    if (elements[0] !== '$') {
      return false;
    }

    return true;
  }
}
