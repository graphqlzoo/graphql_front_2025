class ZooIdStore {
  private static instance: ZooIdStore;
  private zooId: string = "";

  private constructor() {
    const storedZooId = localStorage.getItem("zoo_id");
    if (storedZooId) {
      this.zooId = storedZooId;
    }
  }

  public static getInstance(): ZooIdStore {
    if (!ZooIdStore.instance) {
      ZooIdStore.instance = new ZooIdStore();
    }
    return ZooIdStore.instance;
  }

  public setZooId(zooId: string) {
    this.zooId = zooId;
    localStorage.setItem("zoo_id", zooId); // Persist to localStorage
  }

  public getZooId(): string | null {
    return this.zooId || localStorage.getItem("zoo_id");
  }

  public clearZooId() {
    this.zooId = "";
    localStorage.removeItem("zoo_id");
  }
}

export default ZooIdStore.getInstance();
