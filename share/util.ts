export class Util{
    /**
     * 唯一标识生成
     */
    public static uuid(): string {
        function createRandom() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (createRandom() + createRandom() + '-' + createRandom() + '-' + createRandom() + '-' + createRandom() + '-' + createRandom() + createRandom() + createRandom());
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

        const script = iframe.contentDocument.createElement('script');
        script.innerHTML = `
            (function () {
                window.print();
                window.onafterprint = () => {
                    window.parent.document.querySelector('#view-print-param').remove();
                };
            }())
        `;
        iframe.contentDocument.body.append(script);
     }
}
