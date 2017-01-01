import * as Immutable from 'immutable';

interface StorageJSON {
    ver: string
}

interface StorageJSON1_0_0 {
    ver: "1.0.0",
    topicFav: string[],
    topicRead: { topic: string, res: string }[],
}

interface StorageJSON2 {
    ver: "2",
    topicFav: string[],
    topicRead: { topic: string, res: string, count: number }[]
}

interface StorageJSON3 {
    ver: "3",
    topicFavo: string[],
    topicRead: { [key: string]: { res: string, count: number } };
}

export class Storage {
    static VER: "3" = "3";
    readonly topicFavo: Immutable.Set<string>;
    readonly topicRead: Immutable.Map<string, { res: string, count: number }>;

    private constructor(topicFavo: Immutable.Set<string>,
        topicRead: Immutable.Map<string, { res: string, count: number }>) {
        this.topicFavo = topicFavo;
        this.topicRead = topicRead;
    }

    private copy({topicFavo = this.topicFavo, topicRead = this.topicRead}: { topicFavo?: Immutable.Set<string>, topicRead?: Immutable.Map<string, { res: string, count: number }> }): Storage {
        return new Storage(topicFavo, topicRead);
    }

    setTopicRead(topic: string, res: string, count: number): Storage {
        return this.copy({ topicRead: this.topicRead.set(topic, { res, count }) });
    }

    setFavo(topicFavo: Immutable.Set<string>): Storage {
        return this.copy({ topicFavo });
    }

    private static convert1_1_1To2(val: StorageJSON1_0_0): StorageJSON2 {
        return {
            ver: "2",
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


    static fromJSON(json: string): Storage {
        if (json.length !== 0) {
            let obj = JSON.parse(json) as StorageJSON;
            while (true) {
                switch (obj.ver) {
                    case "0.0.0":
                        //バージョン0
                        obj = this.convert1_1_1To2(obj as StorageJSON1_0_0);
                        break;
                    case "2":
                        {
                            obj = this.convert2To3(obj as StorageJSON2);
                            break;
                        }
                    case "3":
                        {
                            let json = obj as StorageJSON3;

                            return new Storage(Immutable.Set(json.topicFavo), Immutable.Map(json.topicRead));
                        }
                    default:
                        return new Storage(Immutable.Set<any>(), Immutable.Map<any, any>());
                }
            }
        } else {
            return new Storage(Immutable.Set<any>(), Immutable.Map<any, any>());
        }
    }

    toJSON(): string {
        let j: StorageJSON3 = {
            ver: Storage.VER,
            topicFavo: this.topicFavo.map(x => x).toArray(),
            topicRead: this.topicRead.toObject()
        };

        return JSON.stringify(j);
    }
}