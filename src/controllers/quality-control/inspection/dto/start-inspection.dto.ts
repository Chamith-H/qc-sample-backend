import { IsNotEmpty } from 'class-validator';

export class StartInspectionDto {
  @IsNotEmpty()
  stageName: string;

  @IsNotEmpty()
  docNum: string;

  @IsNotEmpty()
  itemCode: string;

  @IsNotEmpty()
  quantity: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  samplingMethod: string;

  @IsNotEmpty()
  samplingLogics: any[];
}
