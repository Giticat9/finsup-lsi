import {Exclude, Expose, Transform} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, Matches} from 'class-validator';
import {AppTypeEnum} from 'src/entities/AppType.entity';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class SendRequestDTO {
    @ApiPropertyOptional({name: 'application_id', description: 'ID заявки'})
    @Expose()
    @Transform(({obj}) =>
        'application_id' in obj
            ? AppTypeEnum.FSAPP
            : 'purchase_number' in obj
                ? AppTypeEnum.FZ44
                : AppTypeEnum.FZ223,
    )
    @IsString()
    appType: string;

    @ApiPropertyOptional({name: 'target', description: 'Цель заявки'})
    @IsOptional()
    @IsString()
    target: string;

    @ApiPropertyOptional({name: 'last_name', description: 'Фамилия'})
    @Expose({name: 'last_name'})
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiPropertyOptional({name: 'first_name', description: 'Имя'})
    @Expose({name: 'first_name'})
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiPropertyOptional({name: 'phone', description: 'Телефон'})
    @IsString()
    @IsOptional()
    phone: string;

    @ApiPropertyOptional({name: 'email', description: 'Email'})
    @IsString()
    @IsOptional()
    email: string;

    @ApiPropertyOptional({name: 'organization_name', description: 'Название организации'})
    @Expose({name: 'organization_name'})
    @IsString()
    @IsOptional()
    organizationName: string;

    @ApiProperty({name: 'company_inn', description: 'ИНН организации'})
    @Expose({name: 'company_inn'})
    @IsNotEmpty({message: 'ИНН обязателен для заполнения'})
    @Matches(/^(?:\d{10}|\d{12})$/, {
        message: 'ИНН должен состоять только из цифр, 10 или 12 символов',
    })
    companyInn: string;

    @ApiPropertyOptional({name: 'period', description: 'Период'})
    @IsString()
    @IsOptional()
    period: string;

    @ApiPropertyOptional({name: 'amount', description: 'Сумма'})
    @Expose()
    @Transform(({obj}) => obj?.amount ?? obj?.contract_amount ?? null)
    @IsOptional()
    amount: string;

    @Exclude()
    public get isFL() {
        return this.companyInn.length === 12;
    }
}
