import { IsNotEmpty, IsOptional } from 'class-validator';

export class ItemParameterDto {
  @IsNotEmpty()
  stage: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  samplingMethod: string;

  @IsOptional()
  samplingLogics: any[];

  @IsNotEmpty()
  parameterLines: any[];
}
