/**
 * @author lw
 * @date 2020/11/23
 */
import { Controller, Post, Get, RequestMapping } from '@/core/decorator/ControllerDecorator'
import { UserRouterContext } from '@/types/UserRouterContext'
import Result from '@/src/utils/Result'
import { Auth } from '@/core/decorator/AuthDecorator'
import Tag from '@/src/model/Tag'
import TagService from '@/src/service/TagService'
import { AutoWired } from '@/core/decorator/ContainerDecorator'

@Controller
@RequestMapping('tag')
export default class TagController {
  @AutoWired
  private tagService: TagService
  /**
   * 得到所有标签
   * @param ctx
   */
  @Get('/list')
  public async list (ctx: UserRouterContext) {
    ctx.body = Result.success([])
  }

  /**
   * 得到所有标签 和 标签备注
   * @param ctx
   * @return [{ remarks: [] }]
   */
  @Auth
  @Get('/listAndRemarks')
  public async tagListAndRemarks (ctx: UserRouterContext) {
    const userId = ctx.getUserId()
    const { type } = ctx.request.body
    const tagList = await this.tagService.getTagAndRemarksByUserIdAndType(userId, [1, 0].includes(Number(type)) ? type : undefined)
    ctx.body = Result.success(tagList)
  }

  /**
   * 添加标签
   * @param ctx
   */
  @Post('/add')
  public async add (ctx: UserRouterContext) {
    let { name, icon, type } = ctx.request.body
    name = name.trim()
    icon = icon.trim()
    if (!name || !icon || type === undefined || ![0, 1].includes(Number(type))) {
      ctx.body = Result.argError()
      return
    }
    const tag = Tag.build({ name, icon, type })
    ctx.body = Result.success(await this.tagService.addTag(tag))
  }
}
