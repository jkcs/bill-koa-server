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

  async getRemarksByRemark (tagId: number, userId: number, remark: string) {
    return await TagRemarks.findOne({
      where: {
        TagId: tagId,
        UserId: userId,
        remark
      }
    })
  }

  async findOrCreateRemarks (tagId: number, userId: number, remark: string) {
    return await TagRemarks.findOrCreate({
      where: { tagId, userId, remark }
    })
  }
}
