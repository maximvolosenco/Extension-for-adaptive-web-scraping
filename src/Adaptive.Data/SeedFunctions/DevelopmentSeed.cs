using Adaptive.DataObjects;

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

            var review1 = CreateReview(context, 4, "Good enough");
            var review2 = CreateReview(context, 3, "so so");

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

        private Review CreateReview(
            AdaptiveContext context,
            int score,
            string description)
        {
            Review review = new Review
            {
                Score = score,
                Description = description
            };

            context.Reviews.Add(review);

            return review;
        }
    }
}
