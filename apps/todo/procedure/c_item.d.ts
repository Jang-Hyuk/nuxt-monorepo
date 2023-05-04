namespace c_item {

  /** 
   * 쿠폰 > 쿠폰발급 > 발급대기/발급내역(cpnIssueSlct 값으로 구분)
   */
  export namespace example_1 {
    export type Param = {
      /** 발급구분['':전체,a:발급대기,b:발급내역]      ==> 발급대기/발급내역 CHAR(1) */
      cpnIssueSlct: '' | 'a' | 'b';
      /** 쿠폰타입['':전체,a:쿠폰할인]       ==> 기본값 '' CHAR(1) */
      cpnType: '' | 'a';
      /** 페이지 번호 INT UNSIGNED */
      pageNo: number;
      /** 페이지 당 노출 건수 (Limit) INT UNSIGNED */
      pagePerCnt: number;
    }
    export type Row0 = {
      /** 검색개수 INT */
      cnt: number;
    }
    export type Row1 = {
      /** 쿠폰 고유번호 INT(11) */
      cpn_no: string;
      /** 쿠폰발급방법[a:관리자지급,b:회원개별요청시발급]   ==> 추가[2023-03-09 MSH] CHAR(1) */
      issue_mthd: 'a' | 'b';
      /** 쿠폰 타이틀(30자)        ==> 쿠폰내용 > 제목 VARCHAR(300) */
      cpn_title: string;
      /** 쿠폰 항목[a:코인할인] CHAR(1) */
      cpn_type: 'a';
      /** 쿠폰 비율(%)         ==> 쿠폰내용 > 할인비율 INT(11) */
      cpn_rate: string;
      /** 결제 최소 금액 남(WEB,AOS) INT(11) */
      m_w_pay_amt_min: number;
      /** 결제 최소 금액 남(IOS) INT(11) */
      m_i_pay_amt_min: number;
      /** 결제 최소 금액 여(WEB,AOS) INT(11) */
      f_w_pay_amt_min: number;
      /** 결제 최소 금액 여(IOS) INT(11) */
      f_i_pay_amt_min: number;
      /** 테스트 여부['':전체,y:테스트,n:일반,d:직접입력] CHAR(1) */
      srch_chrgr_yn: '' | 'y' | 'n' | 'd';
      /** 성별['':전체,m:남자,f:여자] CHAR(1) */
      srch_mem_sex: '' | 'm' | 'f';
      /** 검색 나이구분[a:10,b:20,c:30,d:40,e:50,f:60,g:70이상,h:조건]  ==> 나이 VARCHAR(100) */
      srch_mem_ages: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
      /** 쿠폰상태[a:대기,b:사용(발급수=사용수),c:미사용(발급수!=사용수),d:만료,e:중단]  ==> 쿠폰상태 CHAR(1) */
      use_slct: 'a' | 'b' | 'c' | 'd' | 'e';
    }
    export type Rows = [Row0[], Row1[]]
  }
}
