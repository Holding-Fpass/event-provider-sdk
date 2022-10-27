import { Metadata, MetadataMap } from "../schema";
import * as handlebars from "handlebars";

export class I18nDictionary {
  private metadataMap: MetadataMap<string>;

  constructor(readonly instanceI18nMetadata: Metadata<string>[]) {
    this.metadataMap = new MetadataMap(instanceI18nMetadata);
  }

  get(string: string, context?: { [key: string]: string }) {
    const text = this.metadataMap.get(string)?.value ?? string;
    if (!context) return text;
    const template = handlebars.compile(text);
    return template(context);
  }
}
