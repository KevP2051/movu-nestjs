import { TmdbCreditMember } from "../interfaces/tmdb-credit-member.interface";
import { TmdbCast, TmdbMovieCreditsResponse } from "../interfaces/tmdb-movie-credits.response";

export class TmdbCreditMapper {

    static toContentCreditEntity(data: TmdbMovieCreditsResponse): TmdbCreditMember[] {

        const tmdbCastMembers: TmdbCreditMember[] = data.cast.map((creditMember: TmdbCast) => ({

            tmdbId: creditMember.id,
            character: creditMember.character,
            name: creditMember.name,
            knownForDepartment: creditMember.known_for_department,
            profilePath: creditMember.profile_path ?? undefined
        }));

        return tmdbCastMembers;

    }
}