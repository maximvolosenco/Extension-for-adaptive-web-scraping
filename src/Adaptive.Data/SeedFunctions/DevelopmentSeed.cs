using Adaptive.DataObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.Data.SeedFunctions
{
    public class DevelopmentSeed
    {
        public DevelopmentSeed()
        { }

        public void Seed(AdaptiveContext context)
        {
            if (context.Users.Any())
                return;

            var user1 = CreateUser(context, "fakeusernr1@gmail.com");
            var user2 = CreateUser(context, "fakeusernr2@gmail.com");
            var user3 = CreateUser(context, "fakeusernr3@gmail.com");

            context.SaveChanges();
        }

        private User CreateUser(
            AdaptiveContext context,
            string email)
        {
            User user = new User
            {
                Email = email
            };

            context.Users.Add(user);

            return user;
        }
    }
}
