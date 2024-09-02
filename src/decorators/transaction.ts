import {
    ArgumentMetadata,
    createParamDecorator,
    ExecutionContext,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { TransactionContext } from 'src/utils/db/transaction';
import { DataSource } from 'typeorm';

@Injectable()
class InjectDataSourcePipe implements PipeTransform {
    constructor(private readonly dataSource: DataSource) {}

    transform(value: TransactionContext, _: ArgumentMetadata) {
        value.dataSource = this.dataSource;
        return value;
    }
}

const transactionContext = createParamDecorator(() => new TransactionContext());
export const ReqTransaction = () => transactionContext(InjectDataSourcePipe);
