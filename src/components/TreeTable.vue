<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  type ColDef,
  type ICellRendererParams,
  type ValueGetterParams,
  type CellClassParams,
  type GridReadyEvent,
} from 'ag-grid-community'
import { RowGroupingModule } from 'ag-grid-enterprise'
import { TreeStore, type TreeItem } from '../tree-store/TreeStore'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule])

const items: TreeItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

const store = new TreeStore(items)
const rowData = ref<TreeItem[]>(store.getAll())

function getDataPath(data: TreeItem): string[] {
  return store.getAllParents(data.id)
    .reverse()
    .map((item) => String(item.id))
}

const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  minWidth: 240,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: ICellRendererParams) =>
      params.node?.group ? 'Группа' : 'Элемент',
  },
  cellClass: (params: CellClassParams) =>
    params.node?.group ? 'cell-bold' : '',
}

const columnDefs: ColDef[] = [
  {
    headerName: '№ п\\п',
    valueGetter: (params: ValueGetterParams) => (params.node?.rowIndex ?? 0) + 1,
    width: 120,
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
    cellClass: (params: CellClassParams) =>
      params.node?.group ? 'cell-bold' : '',
  },
]

const defaultColDef: ColDef = {
  resizable: true,
  sortable: false,
}

function onGridReady(params: GridReadyEvent) {
  params.api.moveColumn('ag-Grid-AutoColumn', 1)
}
</script>

<template>
  <div class="tree-table">
    <div class="mode-bar">Режим: просмотр</div>
    <AgGridVue
      class="ag-theme-alpine"
      style="height: 500px; width: 100%"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :treeData="true"
      :getDataPath="getDataPath"
      :autoGroupColumnDef="autoGroupColumnDef"
      :defaultColDef="defaultColDef"
      :groupDefaultExpanded="-1"
      :onGridReady="onGridReady"
      animateRows
    />
  </div>
</template>

<style scoped>
.tree-table {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  font-family: sans-serif;
}

.mode-bar {
  padding: 8px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 13px;
  color: #4a9fd4;
}
</style>

<style>
.cell-bold {
  font-weight: bold;
}
</style>
