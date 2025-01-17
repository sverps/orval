import { InfoObject } from 'openapi3-ts';
import { OutputClient } from '../../types';
import { GeneratorOperations } from '../../types/generator';
import { pascal } from '../../utils/case';
import { generalTypesFilter } from '../../utils/filters';
import {
  generateClientFooter,
  generateClientHeader,
} from '../generators/client';

export const generateTarget = (
  operations: GeneratorOperations,
  info: InfoObject,
  outputClient?: OutputClient,
) =>
  Object.values(operations).reduce(
    (acc, operation, index, arr) => {
      if (!index) {
        const header = generateClientHeader(outputClient, pascal(info.title));
        acc.definition += header.definition;
        acc.implementation += header.implementation;
        acc.implementationMocks += header.implementationMock;
        acc.implementationMSW += header.implementationMSW;
      }

      acc.imports = [
        ...acc.imports,
        ...operation.imports,
        ...operation.importsMocks,
      ];
      acc.definition += operation.definition;
      acc.implementation += operation.implementation;
      acc.implementationMocks += operation.implementationMocks;
      acc.implementationMSW += operation.implementationMSW;

      if (index === arr.length - 1) {
        const footer = generateClientFooter(outputClient);
        acc.definition += footer.definition;
        acc.implementation += footer.implementation;
        acc.implementationMocks += footer.implementationMock;
        acc.implementationMSW += footer.implementationMSW;
        acc.imports = generalTypesFilter(acc.imports);
      }
      return acc;
    },
    {
      imports: [] as string[],
      definition: '',
      implementation: '',
      implementationMocks: '',
      implementationMSW: '',
    },
  );
