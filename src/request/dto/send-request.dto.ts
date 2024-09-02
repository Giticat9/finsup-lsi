import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { AppTypeEnum } from 'src/entities/AppType.entity';

export class SendRequestDTO {
    @Expose()
    @Transform(({ obj }) =>
        'application_id' in obj
            ? AppTypeEnum.FSAPP
            : 'purchase_number' in obj
              ? AppTypeEnum.FZ44
              : AppTypeEnum.FZ223,
    )
    @IsString()
    appType: string;

    @IsOptional()
    @IsString()
    target: string;

    @Expose({ name: 'last_name' })
    @IsString()
    @IsOptional()
    lastName: string;

    @Expose({ name: 'first_name' })
    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    email: string;

    @Expose({ name: 'organization_name' })
    @IsString()
    @IsOptional()
    organizationName: string;

    @Expose({ name: 'company_inn' })
    @IsNotEmpty({ message: 'ИНН обязателен для заполнения' })
    @Matches(/^(?:\d{10}|\d{12})$/, {
        message: 'ИНН должен состоять только из цифр, 10 или 12 символов',
    })
    companyInn: string;

    @IsString()
    @IsOptional()
    period: string;

    @Expose()
    @Transform(({ obj }) => obj?.amount ?? obj?.contract_amount ?? null)
    @IsOptional()
    amount: string;
}
