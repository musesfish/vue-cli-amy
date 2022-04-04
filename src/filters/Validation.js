/**
 * 验证
 * Function [isNumber] - 验证是否两位小数实数
 * Function [isCnName] - 中文名称 2-5位
 * Function [isMoney] - 正浮点数的金额正则 
 */
const Validation = {
    isNumber(str){
        return /^\d+(.\d+)?$/.test(str)
    },
    isCnName(str){
        return /^[\u4E00-\u9FA5]{2,5}$/.test(str)
    },
    isMoney(str){
        return /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/.test(str)
    },
    changeDay(str){
        switch(str){
            case '1':
                return '一';
            case '2':
                return '二';
            case '3':
                return '三';
            case '4':
                return '四';
            case '5':
                return '五';
            case '6':
                return '六';
            case '7':
                return '七';
            default:
                ''
        }
    },
}
export default Validation;