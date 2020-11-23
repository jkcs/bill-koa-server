/**
 * @author lw
 * @date 2020/11/23
 */
import { AutoWired, Service } from '@/core/decorator/ContainerDecorator'
import Tag from '@/src/model/Tag'
import TagRemarksService from '@/src/service/TagRemarksService'

@Service
export default class TagService {
  @AutoWired
  private tagRemarksService: TagRemarksService
  async addTag (tag: Tag) {
    return await tag.save()
  }
  async getTagListByType (type: 1|0) {
    return await Tag.findAll({ where: { type } })
  }
  async getTagList () {
    return await Tag.findAll()
  }
  async getTagAndRemarksByUserIdAndType (userId: number, type?: 1|0) {
    let tags = type === undefined
      ? await this.getTagList()
      : await this.getTagListByType(type)
    const tagRemarksList = await this.tagRemarksService.getTagRemarksListByUserId(userId)
    const list:any[] = []
    tagRemarksList.forEach(tagRemarks => {
      let index = list.findIndex(item => item.tagId === tagRemarks.getDataValue('TagId'))
      if (index !== -1) {
        list[index].remarks.push({ ...tagRemarks })
      } else {
        list.push({
          tagId: tagRemarks.getDataValue('TagId'),
          remarks: [{ ...tagRemarks }]
        })
      }
    })
    tags.map(tag => {
      const find = list.find(t => t.tagId === tag.id)
      return {
        ...tag,
        remarks: find ? find.remarks : []
      }
    })
    return tags
  }
}
