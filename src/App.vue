<script setup>
import ScheduleManagement from './pages/ScheduleManagement.vue';  
import zhCn from 'element-plus/es/locale/lang/zh-cn' 
</script>

<template>
  <el-config-provider namespace="el" :locale="zhCn"> 
    <div class="main-container">  
      <RouterView /> 
    </div>
  </el-config-provider>
</template>

<style lang="scss" scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  height: 100%;
  display: flex;
  align-self: center;
  box-sizing: border-box;
}
</style>

 