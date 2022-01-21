export type NormalizedResult<
  Entities extends Record<string, Record<string, any>>,
  RecordType = string
> = {
  entities: Entities;
  result: RecordType | RecordType[];
};
