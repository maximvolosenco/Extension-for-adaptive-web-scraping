using Adaptive.DataObjects;
using Adaptive.WebApi.DTO;
using AutoMapper;

namespace Adaptive.WebApi.Mapper
{
    public class ReviewProfile : Profile
    {
        public ReviewProfile()
        {
            CreateMap<Review, ReviewDTO>();
            CreateMap<ReviewDTO, Review>();
        }
    }
}
