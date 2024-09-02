import { IsString } from 'class-validator';
import { SendRequestDTO } from './send-request.dto';

export class MailRequestDTO extends SendRequestDTO {
    constructor(request?: SendRequestDTO) {
        super();

        this.appType = request?.appType!;
        this.target = request?.target!;
        this.lastName = request?.lastName!;
        this.firstName = request?.firstName!;
        this.phone = request?.phone!;
        this.email = request?.email!;
        this.organizationName = request?.organizationName!;
        this.companyInn = request?.companyInn!;
        this.period = request?.period!;
        this.amount = request?.amount!;
    }

    @IsString()
    applicationId: string;
}
