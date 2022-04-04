const server = {
  getUserInfo(){
    return this.http.get("xxx").then(res=>res.body).catch(function (response) {
      console.error(response);
      return {ret: -1}
    });
  },
}

export default server;