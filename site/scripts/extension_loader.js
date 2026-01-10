import { parse, stringify } from 'https://esm.sh/smol-toml@1.6.0'

const doc = "key = 'value'";
const parsed = parse(doc);
console.log(parsed);