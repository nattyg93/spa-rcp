import { JsonapiResourceIdentifier } from 'spraypaint';
import { WritePayload } from 'spraypaint/lib-esm/util/write-payload';

const DEV = process.env.NODE_ENV === 'development';

type Hash<T> = { [key: string]: T };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HashAny = Hash<any>;

/* eslint-disable */
// NOTE: A hacky solution for unsetting hasone relationships since Spraypaint
//       apparently completely ignores nulling HasOne relationships.
const _relationships = WritePayload.prototype.relationships;
WritePayload.prototype.relationships = function() {
  const rels: HashAny = _relationships.call(this);
  let origRels: Hash<JsonapiResourceIdentifier[]> = {};
  try {
    // NOTE: wrapped in try/catch since this is an internal api and might change
    origRels = this.model._originalRelationships;
  } catch (err) {
    if (window && window.console) {
      console.warn('Spraypaint model API has changed - we no longer can access the original relationsips!');
      console.error(err);
    }
    throw new Error('Spraypaint model API has changed!');
  }
  Object.keys(this.includeDirective).forEach((key: any) => {
    if (key.indexOf('.') > -1) {
      key = key.split('.')[0];
    }
    const relatedModels = (<any>this.model)[key];
    // NOTE: here we ensure the relationship is marked for disassociation
    //       or if it is currently null, but was not before!
    if (
      (relatedModels && relatedModels.isMarkedForDisassociation) ||
      (relatedModels === null && (origRels[key] || []).length)
    ) {
      if (DEV) {
        console.warn(`will null the '${key}' relationship`);
      }
      rels[this.model.klass.serializeKey(key)] = { data: null };
    }
  });
  return rels;
};
/* eslint-enable */
