function MountedDisk(info){

    this.info = info;
    this.name = this.info.split(" ")[1].split("Label:")[1];
    this.root = this.info.split(" ")[0];
    this.blockSize = undefined;
    this.storageSize = undefined;
    this.storageUsed = undefined;

    this.getDiskSize = function () {
        return Number((this.storageSize * this.blockSize / (1024 * 1024 * 1024)).toFixed(1));
    }

    this.getDiskUsed = function () {
        return Number((this.storageUsed * this.blockSize / (1024 * 1024 * 1024)).toFixed(1));
    }

    this.getDiskFree = function () {
        return this.getDiskSize() - this.getDiskUsed();
    }
}