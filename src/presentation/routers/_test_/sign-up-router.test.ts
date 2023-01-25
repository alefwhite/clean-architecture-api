import { HttpResponse } from "../../protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { EmailValidatorSpy } from "./mocks/mock-email-validator";

type Request = {
    body: {
        email?: string;
    }
}

class SignUpRouter {
    constructor(private emailValidator: EmailValidatorSpy) { }

    async handle(request: Request): Promise<HttpResponse> {
        const { email } = request.body
        if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
        if (!this.emailValidator.isValid(email)) {
            return HttpResponse.badRequest(new InvalidParamError('email'));
        }
        return HttpResponse.ok({});
    }
}

const makeSut = () => {
    const emailValidator = new EmailValidatorSpy();
    const sut = new SignUpRouter(emailValidator);
    return {
        emailValidator,
        sut
    }
}

describe('SignUp Router', () => {
    it('Should returns 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {}
        }
        const response = await sut.handle(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('Should returns 400 if an invalid email is provided', async () => {
        const { sut, emailValidator } = makeSut();
        emailValidator.isEmailValid = false;
        const httpRequest = {
            body: {
                email: 'invalid_email'
            }
        }
        const response = await sut.handle(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });
});