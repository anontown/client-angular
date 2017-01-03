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

export class Storage {
    static VER: '3' = '3';

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
                            let obj = JsonObj as StorageJSON3;
                            return new Storage(Immutable.Set(obj.topicFavo), Immutable.Map(obj.topicRead));
                        }
                    default:
                        return new Storage(Immutable.Set<any>(), Immutable.Map<any, any>());
                }
            }
        } else {
            return new Storage(Immutable.Set<any>(), Immutable.Map<any, any>());
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
            ver: "3",
            topicFavo: val.topicFav,
            topicRead: read
        };
    }


    readonly topicFavo: Immutable.Set<string>;
    readonly topicRead: Immutable.Map<string, { res: string, count: number }>;

    private constructor(topicFavo: Immutable.Set<string>,
        topicRead: Immutable.Map<string, { res: string, count: number }>) {
        this.topicFavo = topicFavo;
        this.topicRead = topicRead;
    }

    setTopicRead(topic: string, res: string, count: number): Storage {
        return this.copy({ topicRead: this.topicRead.set(topic, { res, count }) });
    }

    setFavo(topicFavo: Immutable.Set<string>): Storage {
        return this.copy({ topicFavo });
    }


    toJSON(): string {
        let j: StorageJSON3 = {
            ver: Storage.VER,
            topicFavo: this.topicFavo.map(x => x).toArray(),
            topicRead: this.topicRead.toObject()
        };

        return JSON.stringify(j);
    }


    private copy({topicFavo = this.topicFavo, topicRead = this.topicRead}:
        { topicFavo?: Immutable.Set<string>, topicRead?: Immutable.Map<string, { res: string, count: number }> }): Storage {
        return new Storage(topicFavo, topicRead);
    }
}