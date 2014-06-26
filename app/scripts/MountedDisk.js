function MountedDisk(info){

    this.info = info;
    this.name = this.info.split(" ")[1].split("Label:");
    this.root = this.info.split(" ")[0];
    this.blockSize = undefined;
    this.totalSpace = undefined;
    this.freeSpace = undefined;
    this.usedSpace = undefined;
}