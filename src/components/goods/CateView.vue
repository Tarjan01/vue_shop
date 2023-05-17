<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
        :show-index="true" index-text="#" border>
        <!--是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightblue"></i>
          <i class="el-icon-error" v-else style="color: lightblue"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          {{ scope.row.data }}
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!--添加分类的对话框-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCatedialogClosed">
      <!--添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--options 用来指定数据源-->
          <!--props 用来指定配置对象-->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 表示当前列是模板列
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        // 表示当前列是模板列
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        // 表示当前列是模板列
        type: 'template',
        template: 'opt'
      }],
      // 添加分类的对话框是否显示
      addCateDialogVisible: false,
      // 添加分类的表单对象
      addCateForm: {
        // 将要添加的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 将要添加的分类的等级
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 所有的父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 级联选择器选中的值
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败！')
      // 数据列表赋值给cateList
      console.log(res)
      this.catelist = res.data.result
      // 总数据条数赋值
      this.total = res.data.total
    },
    // 当前页码改变的时候触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 每页显示条数改变的时候触发
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类的对话框
    showAddCateDialog () {
      // 获取所有的父级分类列表
      this.getParentCateList()
      // 显示对话框
      this.addCateDialogVisible = true
    },
    // 获取所有的父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表失败！')
      this.parentCateList = res.data
    },
    // 父级分类改变的时候触发
    parentCateChange () {
      // 如果selectedKeys的长度为0，表示用户清空了选中的值
      // 此时应该将cat_pid设置为0，cat_level设置为0
      // 否则，应该将cat_pid设置为最后一个元素的id，cat_level设置为最后一个元素的等级+1
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1].cat_id
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        console.log(res)
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 添加分类对话框关闭的时候触发
    addCatedialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px
}

.el-cascader {
  width: 100%;
}
</style>
