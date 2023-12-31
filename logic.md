## 예약 결제

body값으로 받을 거: [ PerformanceId, ScheduleId, 등급, 좌석 번호(여러 개) ]

다른 테이블에서 참조 받아 사용 할 거: [ 공연 가격 ]

---

trasactionStart
동시성 처리 - 결제 시작전에 체크 ( 좌석 상태 check fasle면 rollback)

---

for문 돌리기
save 객체배열 형식 만들어 넣기 - ts, function

---

reservation 테이블 생성 {
jwt로 얻은 UserId 삽입

body로 받은 PerformanceId 삽입

body로 받은 ScheduleId 삽입

body로 받은 SeatId 삽입
(
body로 받은 등급 삽입 => 등급에 따라 가격 다르게 설정
body로 받은 좌석 번호 삽입 => 좌석 번호의 개수에 따라 배수 다르게 설정 ex) 가격 _ 등급 _ 개수
)
}

---

좌석 테이블 생성
~

등급, 좌석개수 그리고 공연 가격을 계산해서 총 가격을 계산하는 변수 = point

const userPoint = balance find({
where: {UserId: jwtid}
orderby: {createdAt: 'DESC'},
take: 1
select: [ balance ]
})

---

포인트 테이블 생성
save({
income: 0,
expense: point,
balance: userPoint - point
})

---

동시성 처리 - 결제 완료전에 체크 ( 좌석 상태 check fasle면 rollback)
transactioncommit
