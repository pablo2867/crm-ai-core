import {
  authEngine,
} from "./engine";

export interface RequestContext {

  user:
    Awaited<
      ReturnType<
        typeof authEngine.getUser
      >
    >;

  tenant:
    Awaited<
      ReturnType<
        typeof authEngine.getTenant
      >
    >;

}

export async function requestContext():

Promise<RequestContext> {

  const user =
    await authEngine.getUser();

  const tenant =
    await authEngine.getTenant();

  return {

    user,

    tenant,

  };

}