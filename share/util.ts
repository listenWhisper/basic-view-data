export class Util{
    public static uuid(): string {
        function createRandom() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (createRandom() + createRandom() + '-' + createRandom() + '-' + createRandom() + '-' + createRandom() + '-' + createRandom() + createRandom() + createRandom());
    }
}
