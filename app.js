/*jshint esversion: 6 */

let inputOperations = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200.0, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 30000, currency: "EUR" },
  },
  {
    date: "2016-01-07",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 1000.0, currency: "EUR" },
  },
  {
    date: "2016-01-07",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 100.0, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 100.0, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 2,
    user_type: "juridical",
    type: "cash_in",
    operation: { amount: 1000000.0, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 3,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 1000.0, currency: "EUR" },
  },
  {
    date: "2016-02-15",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  },
];
let commissionAmount = 0;
let userWeekAmount = 0;
const usersWeekAmount = [];

const cashIn = (input) => {
  const commission = { percents: 0.03, max: { amount: 5, currency: "EUR" } };

  commissionAmount =
    Math.round(input.operation.amount * commission.percents) / 100;

  return commissionAmount <= 5 ? commissionAmount : 5;
};

const cashOut = (input) => {
  const commission = {
    percents: 0.3,
    week_limit: { amount: 1000, currency: "EUR" },
  };

  if (input.user_type === "natural") {
    const userWeekAmount = currentUserAmount(input);
    const exceededAmount = userWeekAmount - commission.week_limit.amount;

    if (exceededAmount > 0) {
      commissionAmount =
        Math.round(input.operation.amount * commission.percents) / 100;
    } else {
      commissionAmount = 0;
    }
  } else if (input.user_type === "juridical") {
    commissionAmount =
      Math.round(input.operation.amount * commission.percents) / 100;
    commissionAmount <= 0.5 ? 0.5 : commissionAmount;
  }

  return commissionAmount;
};

const getRangeOfWeek = (inputDate) => {
  const date = new Date(inputDate);
  const firstday = new Date(date.setDate(date.getDate() - (date.getDay() - 1)));
  const lastday = new Date(date.setDate(date.getDate() - date.getDay() + 7));
  const weekRange = [firstday, lastday];

  return weekRange;
};

const currentUserAmount = (input) => {
  const inputDate = new Date(input.date);
  const weekRange = getRangeOfWeek(inputDate);

  const user = {
    user_id: input.user_id,
    user_week_amount: userWeekAmount + input.operation.amount,
    week: weekRange,
  };

  const currUser = usersWeekAmount.findIndex(
    (u) => u.user_id === input.user_id
  );

  if (
    currUser !== -1 &&
    usersWeekAmount[currUser].week[0].getTime() >= weekRange[0].getTime() &&
    usersWeekAmount[currUser].week[1].getTime() <= weekRange[1].getTime()
  ) {
    usersWeekAmount[currUser].user_week_amount =
      usersWeekAmount[currUser].user_week_amount + input.operation.amount;
  } else if (currUser !== -1) {
    usersWeekAmount[currUser].user_week_amount = input.operation.amount;
    usersWeekAmount[currUser].week = weekRange;
  } else {
    usersWeekAmount.push(user);
  }

  return usersWeekAmount[currUser] !== undefined
    ? usersWeekAmount[currUser].user_week_amount
    : user.user_week_amount;
};

const userOperation = (inputOperations) => {
  let commission = 0.0;
  const result = [];

  inputOperations.map((x) => {
    if (x.type === "cash_in") {
      commission = cashIn(x);
    } else if (x.type === "cash_out") {
      commission = cashOut(x);
    }

    result.push(commission.toFixed(2));
  });

  return result;
};

console.log(userOperation(inputOperations));
