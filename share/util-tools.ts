export class UtilTools {

    /**
     * 唯一标识生成
     */
    public static uuid(): string {
        function createRandom() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (createRandom() + createRandom() + '-' + createRandom() + '-' + createRandom() + '-' + createRandom() + '-' + createRandom() + createRandom() + createRandom());
    }


    public static createBasicViewListItems<T>(list: T[]) {
        return {_Items: list}
    }

    public static dateSupplement(zero: number): string{
        let date = zero.toString();
        if (zero.toString().length == 1) {
            date = `0${zero}`;
        }
        return date;
    }

    /**
     * 文件下载
     * @param url 文件地址
     */
     public static downloadFile(url: string): void{
        const a = document.createElement('a');
        a.href = url;
        // @ts-ignore
        if(url.endsWith('.pdf')){
            a.target = '_blank';
        }
         a.download = '';
         a.click();
     }

     public static pathLink(url: string, target: string = '_blank'): void{
        if(!url){
            console.error('路径未知');
            return;
        }
        const a = document.createElement('a');
        a.href = url;
        a.target = target;
        a.click();
     }

     public static timestamp(data: string): string{
         return `${data}${data.indexOf('?') > 0 ? '&': '?'}=${new Date().getTime()}`
     }

    /**
     * 文件打印
     * @param url 文件地址
     */
    public static printFile(url: string){
        const parent = document.body;
        let iframe = document.querySelector('#view-print-frame') as HTMLIFrameElement;
        if(iframe){
            iframe.remove();
        }
        iframe = document.createElement('iframe');
        iframe.id = 'view-print-param';
        iframe.src = url;
        iframe.style.display ='none';
        parent.append(iframe);

        const script = iframe?.contentDocument?.createElement('script');
        if(script){
            script.innerHTML = `
                (function () {
                    window.print();
                    window.onafterprint = () => {
                        window.parent.document.querySelector('#view-print-param').remove();
                    };
                }())
            `;
            iframe?.contentDocument?.body.append(script);
        }

     }
}
