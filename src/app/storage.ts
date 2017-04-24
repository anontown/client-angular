import * as Immutable from 'immutable';

interface StorageJSON {
  ver: string;
}

interface StorageJSON1 {
  ver: '1.0.0';
  topicFav: string[];
  topicRead: { topic: string, res: string }[];
}

interface StorageJSON2 {
  ver: '2',
  topicFav: string[],
  topicRead: { topic: string, res: string, count: number }[]
}

interface StorageJSON3 {
  ver: '3',
  topicFavo: string[],
  topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON4 {
  ver: '4',
  topicFavo: string[],
  boardFavo: string[],
  topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON5 {
  //バグでtopicFavoが壊れたのでリセットする用
  ver: '5',
  topicFavo: string[],
  boardFavo: string[],
  topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON6 {
  ver: '6',
  topicFavo: string[],
  tagsFavo: string[][],
  topicRead: { [key: string]: { res: string, count: number } };
}

export class Storage {
  static VER: '6' = '6';

  static fromJSON(jsonText: string): Storage {
    if (jsonText.length !== 0) {
      let JsonObj = JSON.parse(jsonText) as StorageJSON;
      while (true) {
        switch (JsonObj.ver) {
          case '0.0.0':
            // バージョン0
            JsonObj = this.convert1To2(JsonObj as StorageJSON1);
            break;
          case '2':
            {
              JsonObj = this.convert2To3(JsonObj as StorageJSON2);
              break;
            }
          case '3':
            {
              JsonObj = this.convert3To4(JsonObj as StorageJSON3);
              break;
            }
          case '4':
            {
              JsonObj = this.convert4To5(JsonObj as StorageJSON4);
              break;
            }
          case '5':
            {
              JsonObj = this.convert5To6(JsonObj as StorageJSON5);
              break;
            }
          case '6':
            {
              let obj = JsonObj as StorageJSON6;
              return new Storage(Immutable.Set(obj.topicFavo),
                Immutable.Set(obj.tagsFavo.map(x => Immutable.Set(x))),
                Immutable.Map(obj.topicRead));
            }
          default:
            return new Storage(Immutable.Set<any>(), Immutable.Set<any>(), Immutable.Map<any, any>());
        }
      }
    } else {
      return new Storage(Immutable.Set<any>(), Immutable.Set<any>(), Immutable.Map<any, any>());
    }
  }

  private static convert1To2(val: StorageJSON1): StorageJSON2 {
    return {
      ver: '2',
      topicFav: val.topicFav,
      topicRead: val.topicRead.map(x => {
        return {
          topic: x.topic,
          res: x.res,
          count: 0
        }
      })
    };
  }

  private static convert2To3(val: StorageJSON2): StorageJSON3 {
    let read: { [key: string]: { res: string, count: number } } = {};
    val.topicRead.forEach(x => read[x.topic] = { res: x.res, count: x.count });
    return {
      ver: '3',
      topicFavo: val.topicFav,
      topicRead: read
    };
  }

  private static convert3To4(val: StorageJSON3): StorageJSON4 {
    return {
      ver: '4',
      boardFavo: [],
      topicFavo: val.topicFavo,
      topicRead: val.topicRead
    };
  }

  private static convert4To5(val: StorageJSON4): StorageJSON5 {
    return {
      ver: '5',
      boardFavo: val.boardFavo,
      topicFavo: [],
      topicRead: val.topicRead
    };
  }

  private static convert5To6(val: StorageJSON5): StorageJSON6 {
    return {
      ver: '6',
      tagsFavo: val.boardFavo.map(x => x.split('/')),
      topicFavo: [],
      topicRead: val.topicRead
    };
  }

  tagsFavo: Immutable.Set<Immutable.Set<string>>;
  topicFavo: Immutable.Set<string>;
  topicRead: Immutable.Map<string, { res: string, count: number }>;

  private constructor(topicFavo: Immutable.Set<string>,
    tagsFavo: Immutable.Set<Immutable.Set<string>>,
    topicRead: Immutable.Map<string, { res: string, count: number }>) {
    this.topicFavo = topicFavo;
    this.tagsFavo = tagsFavo;
    this.topicRead = topicRead;
  }


  toJSON(): string {
    let j: StorageJSON6 = {
      ver: Storage.VER,
      tagsFavo: this.tagsFavo.toArray().map(x => x.toArray()),
      topicFavo: this.topicFavo.toArray(),
      topicRead: this.topicRead.toObject()
    };

    return JSON.stringify(j);
  }
}