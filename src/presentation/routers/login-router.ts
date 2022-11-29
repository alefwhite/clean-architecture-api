import { HttpResponse } from "../helpers/http-response";

interface Body {
    email?: string;
    password?: string;
}

export class LoginRouter {
    constructor(private authUseCase: any) { }

    route(httpRequest: { body: Body }): HttpResponse {
        try {
            const { email, password } = httpRequest.body;
            if (!email) return HttpResponse.badRequest('email');
            if (!password) return HttpResponse.badRequest('password');
            const accessToken = this.authUseCase.auth(email, password);
            if (!accessToken) return HttpResponse.unauthorized();
            return HttpResponse.ok({ accessToken });
        } catch (error) {
            return HttpResponse.serverError();
        }
    }
}
