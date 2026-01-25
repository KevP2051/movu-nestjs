import { validate as isUUID } from 'uuid';
import { isEmail } from 'validator';
import { SearchFieldEnum } from '../enums/search-field.enum';
import { USER_REGEX } from '../constants/regex.constants';
import { BadRequestException } from '@nestjs/common';

export function getSearchField(term: string): SearchFieldEnum {
  if (isUUID(term)) {
    return SearchFieldEnum.ID;
  }
  if (isEmail(term)) {
    return SearchFieldEnum.EMAIL;
  }
  if (USER_REGEX.test(term)) {
    return SearchFieldEnum.USER_NAME;
  }
  throw new BadRequestException('Invalid search term: must be a valid ID, email, or username.');
}

