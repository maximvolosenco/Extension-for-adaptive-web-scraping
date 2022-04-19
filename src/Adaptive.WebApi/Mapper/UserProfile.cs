using Adaptive.DataObjects;
using Adaptive.WebApi.DTO;
using AutoMapper;

namespace Adaptive.WebApi.Mapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();
        }
    }
}
