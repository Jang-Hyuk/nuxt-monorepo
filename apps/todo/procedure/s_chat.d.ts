namespace s_chat {

  /** 
   * 1:1채팅 룸종료
   */
  export namespace example_2 {
    export type Param = {
      /** 회원번호(방장 = 신청자) INT */
      memNo: number;
      /** 회원번호(수락자) INT */
      pmemNo: number;
    }
    export type Row0 = {
      /** 결과값[-1:방없음,0:에러,1:성공,2:상대입장전 방나가기] INT */
      s_return: '0' | '1' | '2' | '-1';
      /** 채팅시간 INT */
      s_chatTime: string;
    }
    export type Rows = [Row0[]]
  }
}
