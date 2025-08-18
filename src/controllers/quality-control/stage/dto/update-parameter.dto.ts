import { IsNotEmpty } from 'class-validator';

export class UpdateParameterDto {
  @IsNotEmpty()
  headId: string;

  @IsNotEmpty()
  stage: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  samplingMethod: string;

  @IsNotEmpty()
  samplingLogics: any[];

  @IsNotEmpty()
  DocumentLines: any[];
}
