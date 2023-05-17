<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--警告区域-->
      <el-alert title="注意：只允许为第三级分类设置参数！" type="warning" :closable="false" show-icon>
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>
            选择商品分类：
          </span>
          <!--选择商品分类的级联选择框-->
          <el-cascader v-model="selectedKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--tab页签区-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <!--循环渲染tag标签-->
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{
                  item
                }}</el-tag>
                <!--输入的文本框-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <!--循环渲染tag标签-->
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{
                  item
                }}</el-tag>
                <!--输入的文本框-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数的对话框-->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialgClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改参数的对话框-->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialgClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      // 级联选择框的选中项
      selectedKeys: [],
      // tab页签的激活项
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 添加参数的对话框是否显示
      addDialogVisible: false,
      // 添加参数的表单对象
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      // 修改参数的对话框是否显示
      editDialogVisible: false,
      // 修改参数的表单对象
      editForm: {},
      // 修改参数的表单验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择框的选中项发生变化时触发
    handleChange () {
      this.getParamsData()
    },
    // tab页签被点击时触发
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      // 判断是否为第三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.error('只允许为第三级分类设置参数！')
      }
      // 根据所选的分类id和所处的面板 发送请求获取参数列表
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加一个控制输入框显示隐藏的属性
        item.inputVisible = false
        // 重置输入框的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加参数的对话框关闭时触发
    addDialgClosed () {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 显示修改参数的对话框
    async showEditDialog (attrid) {
      // 根据参数id获取参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrid}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改参数的对话框关闭时触发
    editDialgClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败！')
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    async removeParams (attrid) {
      const confirmRes = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 判断用户是否点击了取消按钮
      if (confirmRes !== 'confirm') return this.$message.info('已取消删除')

      // 发送请求删除参数
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 文本框失去焦点，或者摁下了enter都会触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入了内容，后续继续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 将对attr_vals 的操作保存到数据库
    async saveAttrVals (row) {
      // 发送请求，修改参数的值
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })

      if (res.meta.status !== 200) return this.$message.error('修改参数失败！')
      this.$message.success('修改参数成功！')
    },
    // 显示输入框
    showInput (row) {
      row.inputVisible = true
      // 通过$nextTick()方法，让Vue在下次DOM更新循环结束之后执行这个回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag标签
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 动态参数的按钮是否禁用
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) return true
      return false
    },
    // 获取当前选中的分类的id
    cateId () {
      if (this.selectedKeys.length !== 3) return null
      return this.selectedKeys[2]
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
