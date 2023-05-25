const users = [
      't1 user1',
      't1 user2',
      't2 user1',
      't2 user2',
      't3 user1',
      't3 user2',
      't4 user1',
      't4 user2',
      't5 user1',
      't5 user2',
      't6 admin'
];

let lastIndex: any;

export const getUser = () => {
      let index = Math.floor(Math.random() * users.length);

      if (index === lastIndex) {
            if (index + 1 <= users.length - 1 && (index + 1) !== lastIndex) {
                  index += 1;
            } else if (index - 1 >= 0 && (index - 1) !== lastIndex) {
                  index -= 1;
            } else {
                  index = Math.floor(Math.random() * users.length);
            }
      }

      let user = users[index];
      let id = Number(user.split(" ")[0].replace('t', ''));
      let userId = '1';
      let pass = 'user';

      if (user.includes('admin')) {
            pass = 'admin';
      } else {
            userId = user.slice(-1);
      }

      lastIndex = index;

      return { user, pass, id, userId };
};