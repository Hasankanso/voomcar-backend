/*Created on 05/16/2020 21:58:43.*/


// npm install telesignsdk -save
class SendSmsVerification {

    /**
     * @description tokensisii
     * @route POST /Send
     * @param {Token} token
     */
    async Send(token) {
        const jwt = require('jwt-simple')
        const private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDIz8ghAsVy1xqo\n7TIiR8ThbdhgOwoMOrPI7KZ0dCBe9sNeSFZE4reF4Zrqiatxbeo8iHhACkz/JmbR\nqioA4c8ylXSszN0Ln0gF0CGn5CO7EV4LtRhkYs6XKZUJOH8MH2E1Xd1DbLf+tf02\n5cgn/yQltPtI0NSzlOUMSeUnQMZpymsoVqZYPMyziYC/i4A2jfgCX0K+Wu1a4kqH\ncd5BEYR68DKbjHDiUmK/nC/diyavDI37qSEUoxoVZZT+TDyhSUoX77sbbSTTyUm/\n1HnEqlKoBsJSdbQdyEX2dUfS/fHc2imokzhZPaehl2f8Qegp2IQZ7ZjmiNfbnFzd\nY4pPH9ChAgMBAAECggEAKfozY+EsLLg2ALuKuBtIFvarHVyiGlHYHMeJeT0AOlG7\nn9UfwYkiI4i4ZVBPiCfZp/tAJeTxWQHqSuhXHPWXJkQTTn8JsyECAYMTUgERDg0Q\nm4Jo/a0g8fz1hGasujhCDhGXy/0pTkO1UblBeMjvQbmeMMfEuuCEa+fzkNvLzjet\nBKsA+O1f4wvqXmTKv8jKcVsL8SOm0dbaqrl7GOB4DJkp+sjDw8eJlXjKlrAA9SCD\nP2aIDb8o+HFgPnSqa/wokUtnLIx6Lb6xtC4BRmtJucmMtjgbgRdkkfVCyHdlJiPm\nA648KcJz8YfRC8KIIY/FbaMe2DamF8S09paD3kHc9QKBgQDsRPoJ01ppGsx2RIL2\nkwj/Ne4f6cpQuTW/AujOZtftnitLQhklArD5C2CSacNV+nvWA8d3nP9CdL7vfWar\nLUpZNE9EAw/OsHViuBmrW/QgXMxTziCPvKhCa6XfgpF5rz1QR4C16pCXuzwHcFMC\n12+JKfI9gH68V6ggRZN08yuE3QKBgQDZlMeyP4EbJ8ODQTzdz39OPWDliQS2L3pM\nBQVUjlCJpSZJa/IG8Wjjjb22vEcTpt+T8A5VNaKpNo1SpWqePvBU85EiMH2c9KDB\nluuVX+nzWz35ChWamuClHhrThNTNnxSrKB7g0Vtr+kzFsL1KN8BAO7Zp420DkMuf\nOo3Af7OslQKBgQDSO7ItSgZ53aGvXtkVpNHtnURM20/tsk/TrjgPaM2cHxCw/5i2\nKQXmJKyCu19XwvGsBmLX2Tf9HzrCiVfw2vT8GSKrBvpq1PMuq1gT9Vdt8ITT0WeB\n3sHtkDHhhyIBH+Az7dvmg1iz2qPYjqcesSoK5+sntI2Q84KjbKV/+9xudQKBgQDS\nqmkHvtDkWAXHKf0izmr2eBs/YwD63NFOlXXpvrlf7FU7tZZq/oaN/Ij5SyaOcn37\nIOzft8S8jaMbqCmo+kt8FTAqqESXGYwkpFmJEYrVIzzHyenM/bQQayuSLQRV6nb6\nmSf8iPg5femjZ1J/b6dnCem+cIL2dtWQYAMrpPl0WQKBgQDqzRtCryEYmpZm2kZq\nxx3Ns5Eeo7GAJvH6NqH4vUXb4agWE0Zdki01qEmUrwgRwtPDcGSt8XvpQWm3k13z\nc86WlY5+yAIK3m4BxxkUQDkktJrix0wFJqdNgf4EdGruHSbR2VGLJWgKew9ZSen3\nibNQj69hBRc9xxo8w7vHWjr2Mw==\n-----END PRIVATE KEY-----\n";

        var decoded = jwt.decode(token.token, private_key, 'RS256');
        return decoded;
    }
}
Backendless.ServerCode.addService(SendSmsVerification);