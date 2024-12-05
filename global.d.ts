declare module 'bcryptjs';
declare module 'jsonwebtoken' {
    export type JwtPayload = string | { [key: string]: any };

    export interface SignOptions {
        algorithm?: string;
        expiresIn?: string | number;
        notBefore?: string | number;
        audience?: string | string[];
        issuer?: string;
        jwtid?: string;
        subject?: string;
        noTimestamp?: boolean;
        header?: { [key: string]: any };
    }

    export interface VerifyOptions {
        algorithms?: string[];
        audience?: string | string[];
        clockTimestamp?: number;
        issuer?: string;
        jwtid?: string;
        subject?: string;
        clockTolerance?: number;
        complete?: boolean;
    }

    function sign(payload: string | object | Buffer, secretOrPrivateKey: string | Buffer, options?: SignOptions): string;
    function verify(token: string, secretOrPublicKey: string | Buffer, options?: VerifyOptions): JwtPayload;
    function decode(token: string, options?: object): null | { [key: string]: any } | string;

    export { sign, verify, decode };
}

