import { Service } from '@/core/decorator/ContainerDecorator'
import TagRemarks from '@/src/model/TagRemarks'

/**
 * @author lw
 * @date 2020/11/23
 */
@Service
export default class TagRemarksService {
  async getTagRemarksListByTagAndUserId (tagId: number, userId: number) {
    return await TagRemarks.findAll({
      where: {
        TagId: tagId,
        UserId: userId
      }
    })
  }

  async getTagRemarksListByUserId (userId: number) {
    return await TagRemarks.findAll({
      where: {
        UserId: userId
      }
    })
  }
}
