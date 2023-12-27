export type CoreFn<Params, ReturnValue = Params> = (
  userId: string,
  params: Params
) => Promise<ReturnValue>;
