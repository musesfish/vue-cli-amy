const server = {
  /**
   * 获取海报背景
   * @param {*} params { type: <1: 赠送海报, 2: 99会员海报>}
   */
  getPoster(params){
    return this.$http.get(`xxx`,{ params: params }).then(res=> res.body)
  }
}

export default server;