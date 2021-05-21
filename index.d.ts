import * as http from 'http';

export = Router;

declare namespace Router {

  export interface RouterOptions {
    strict?: boolean;
    caseSensitive?: boolean;
    mergeParams?: boolean;
  }

  interface IncomingRequest extends http.IncomingMessage {
    url: string,
    method: string,
    originalUrl?: string,
    params?: any;
  }

  interface RoutedRequest extends IncomingRequest {
    baseUrl: string,
    next?: NextFunction,
    route?: IRoute
  }

  type RequestParamHandler = (req: IncomingRequest, res: http.ServerResponse, next: NextFunction, value: any, name: string) => any;

  interface RouteHandler {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
    (req: RoutedRequest, res: http.ServerResponse, next: NextFunction): any;
  }

  interface RequestHandler {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
    (req: IncomingRequest, res: http.ServerResponse, next: NextFunction): any;
  }


  interface NextFunction {
    // tslint:disable-next-line callable-types (In ts2.1 it thinks the type alias has no call signatures)
    (err?: any): void;
  }

  type ErrorRequestHandler = (err: any, req: IncomingRequest, res: http.ServerResponse, next: NextFunction) => any;

  type PathParams = string | RegExp | Array<string | RegExp>;

  type RequestHandlerParams = RouteHandler | ErrorRequestHandler | Array<RouteHandler | ErrorRequestHandler>;

  interface IRouterMatcher<T> {
    (path: PathParams, ...handlers: RouteHandler[]): T;
    (path: PathParams, ...handlers: RequestHandlerParams[]): T;
  }

  interface IRouterHandler<T> {
    (...handlers: RouteHandler[]): T;
    (...handlers: RequestHandlerParams[]): T;
  }

  interface IRouter {
    /**
     * Map the given param placeholder `name`(s) to the given callback(s).
     *
     * Parameter mapping is used to provide pre-conditions to routes
     * which use normalized placeholders. For example a _:user_id_ parameter
     * could automatically load a user's information from the database without
     * any additional code,
     *
     * The callback uses the samesignature as middleware, the only differencing
     * being that the value of the placeholder is passed, in this case the _id_
     * of the user. Once the `next()` function is invoked, just like middleware
     * it will continue on to execute the route, or subsequent parameter functions.
     *
     *      app.param('user_id', function(req, res, next, id){
     *        User.find(id, function(err, user){
     *          if (err) {
     *            next(err);
     *          } else if (user) {
     *            req.user = user;
     *            next();
     *          } else {
     *            next(new Error('failed to load user'));
     *          }
     *        });
     *      });
     */
    param(name: string, handler: RequestParamHandler): this;

    /**
     * Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()
     *
     * @deprecated since version 4.11
     */
    param(callback: (name: string, matcher: RegExp) => RequestParamHandler): this;

    /**
     * Special-cased "all" method, applying the given route `path`,
     * middleware, and callback to _every_ HTTP method.
     */
    all: IRouterMatcher<this>;

    use: IRouterHandler<this> & IRouterMatcher<this>;

    handle: RequestHandler;

    route(prefix: PathParams): IRoute;
    // Stack of configured routes
    stack: any[];

    // Common HTTP methods
    delete: IRouterMatcher<this>;
    get: IRouterMatcher<this>;
    head: IRouterMatcher<this>;
    options: IRouterMatcher<this>;
    patch: IRouterMatcher<this>;
    post: IRouterMatcher<this>;
    put: IRouterMatcher<this>;

    // Exotic HTTP methods
    acl: IRouterMatcher<this>;
    bind: IRouterMatcher<this>;
    checkout: IRouterMatcher<this>;
    connect: IRouterMatcher<this>;
    copy: IRouterMatcher<this>;
    link: IRouterMatcher<this>;
    lock: IRouterMatcher<this>;
    "m-search": IRouterMatcher<this>;
    merge: IRouterMatcher<this>;
    mkactivity: IRouterMatcher<this>;
    mkcalendar: IRouterMatcher<this>;
    mkcol: IRouterMatcher<this>;
    move: IRouterMatcher<this>;
    notify: IRouterMatcher<this>;
    pri: IRouterMatcher<this>;
    propfind: IRouterMatcher<this>;
    proppatch: IRouterMatcher<this>;
    purge: IRouterMatcher<this>;
    rebind: IRouterMatcher<this>;
    report: IRouterMatcher<this>;
    search: IRouterMatcher<this>;
    source: IRouterMatcher<this>;
    subscribe: IRouterMatcher<this>;
    trace: IRouterMatcher<this>;
    unbind: IRouterMatcher<this>;
    unlink: IRouterMatcher<this>;
    unlock: IRouterMatcher<this>;
    unsubscribe: IRouterMatcher<this>;
  }

  interface IRoute {
    path: string;
    stack: any;

    all: IRouterHandler<this>;

    // Common HTTP methods
    delete: IRouterHandler<this>;
    get: IRouterHandler<this>;
    head: IRouterHandler<this>;
    options: IRouterHandler<this>;
    patch: IRouterHandler<this>;
    post: IRouterHandler<this>;
    put: IRouterHandler<this>;

    // Exotic HTTP methods
    acl: IRouterHandler<this>;
    bind: IRouterHandler<this>;
    checkout: IRouterHandler<this>;
    connect: IRouterHandler<this>;
    copy: IRouterHandler<this>;
    link: IRouterHandler<this>;
    lock: IRouterHandler<this>;
    "m-search": IRouterHandler<this>;
    merge: IRouterHandler<this>;
    mkactivity: IRouterHandler<this>;
    mkcalendar: IRouterHandler<this>;
    mkcol: IRouterHandler<this>;
    move: IRouterHandler<this>;
    notify: IRouterHandler<this>;
    pri: IRouterHandler<this>;
    propfind: IRouterHandler<this>;
    proppatch: IRouterHandler<this>;
    purge: IRouterHandler<this>;
    rebind: IRouterHandler<this>;
    report: IRouterHandler<this>;
    search: IRouterHandler<this>;
    source: IRouterHandler<this>;
    subscribe: IRouterHandler<this>;
    trace: IRouterHandler<this>;
    unbind: IRouterHandler<this>;
    unlink: IRouterHandler<this>;
    unlock: IRouterHandler<this>;
    unsubscribe: IRouterHandler<this>;
  }

  interface RouterConstructor extends IRouter {
    new(options?: RouterOptions): IRouter & RequestHandler;
  }

}

declare var Router: Router.RouterConstructor;
