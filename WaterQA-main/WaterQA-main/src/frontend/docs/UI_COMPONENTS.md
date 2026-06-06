# 🎨 Hệ thống UI Components (Dự án Quan trắc Nước)

Tài liệu này tổng hợp cách sử dụng các Shared UI Components nằm trong thư mục `components/ui/`. Các component này được thiết kế theo nguyên tắc DRY (Don't Repeat Yourself), hỗ trợ tùy biến cao và tối ưu hiệu suất cho cả iOS lẫn Android.

---

## 📑 Mục lục

1. [Card](#1-card)
2. [StatBox](#2-statbox)
3. [SettingRow](#3-settingrow)
4. [BaseChart](#4-basechart)
5. [AlertBanner](#5-alertbanner)
6. [CustomToast](#6-customtoast)
7. [CustomFilterTab](#7-customfiltertab)
8. [Skeleton (Loading)](#8-skeleton-loading)

---

## 1. Card

Component nền tảng dùng để bọc các khối giao diện lớn. Tự động xử lý viền, đổ bóng, bo góc đồng nhất toàn app.

**Import:**

```tsx
import Card from "@/components/ui/Card";
```

**Props:**
Kế thừa toàn bộ `ViewProps` của React Native (style, children, onLayout,...).

**Cách dùng:**

```tsx
<Card style={{ backgroundColor: "#F0FDF4" }}>
    <Text>Nội dung bên trong thẻ</Text>
</Card>
```

---

## 2. StatBox

Thẻ hiển thị chỉ số thống kê nhỏ (ví dụ: WQI hôm nay, trạng thái cảm biến).

**Import:**

```tsx
import StatBox from "@/components/ui/StatBox";
```

**Props:**

| Prop          | Kiểu dữ liệu                 | Mô tả                                |
| ------------- | ---------------------------- | ------------------------------------ |
| `label`       | `string`                     | Tiêu đề nhỏ phía trên                |
| `value`       | `string           \| number` | Giá trị chính (in đậm, to)           |
| `desc`        | `string`                     | Dòng mô tả nhỏ phía dưới             |
| `valueColor`  | `string`                     | (Tùy chọn) Màu của số và icon        |
| `bgColor`     | `string`                     | (Tùy chọn) Màu nền                   |
| `borderColor` | `string`                     | (Tùy chọn) Màu viền                  |
| `icon`        | `FeatherIconName`            | (Tùy chọn) Tên icon thư viện Feather |

**Cách dùng:**

```tsx
<StatBox
    icon="trending-up"
    label="so với Hôm qua"
    value="+12"
    desc="Chỉ số WQI"
    valueColor="#00A63E"
    bgColor="#F0FDF4"
/>
```

---

## 3. SettingRow

Component đa năng dùng cho danh sách cài đặt, hỗ trợ cả nút điều hướng (mũi tên) và nút gạt (Switch/Toggle).

**Import:**

```tsx
import SettingRow from "@/components/ui/SettingRow";
```

**Props:**

| Prop           | Kiểu dữ liệu             | Mô tả                                 |
| -------------- | ------------------------ | ------------------------------------- |
| `title`        | `string`                 | Tiêu đề chính                         |
| `subtitle`     | `string`                 | (Tùy chọn) Mô tả phụ                  |
| `iconName`     | `FeatherIconName`        | (Tùy chọn) Icon bên trái              |
| `isToggle`     | `boolean`                | Chuyển sang chế độ Nút gạt bật/tắt    |
| `toggleValue`  | `boolean`                | Trạng thái hiện tại của nút gạt       |
| `onToggle`     | `(val: boolean) => void` | Sự kiện khi gạt Switch                |
| `onPress`      | `() => void`             | Sự kiện khi bấm (Tự hiện mũi tên >)   |
| `rightElement` | `ReactNode`              | (Tùy chọn) Element tùy chỉnh bên phải |
| `isLast`       | `boolean`                | Ẩn đường viền dưới cùng của hàng      |

**Cách dùng:**

```tsx
// 1. Dùng làm nút điều hướng
<SettingRow
    iconName="user"
    title="Tài khoản"
    subtitle="Đổi mật khẩu"
    onPress={() => router.push('/profile')}
/>

// 2. Dùng làm Toggle
<SettingRow
    title="Nhận thông báo"
    isToggle={true}
    toggleValue={isNotiEnabled}
    onToggle={setIsNotiEnabled}
/>

```

---

## 4. BaseChart

Bao đóng thư viện vẽ biểu đồ SVG. Hỗ trợ vẽ đường thẳng (linear) hoặc cong (smooth), tự động highlight điểm cao nhất.

**Import:**

```tsx
import BaseChart from "@/components/ui/BaseChart";
```

**Props:**

| Prop           | Kiểu dữ liệu     | Mô tả                                       |
| -------------- | ---------------- | ------------------------------------------- |
| `title`        | `string`         | Tiêu đề biểu đồ                             |
| `data`         | `number[]`       | Mảng dữ liệu các điểm                       |
| `labels`       | `string[]`       | Mảng nhãn trục X                            |
| `smooth`       | `boolean`        | Vẽ đường cong (true) hay gấp khúc (false)   |
| `showValues`   | `boolean`        | Hiện con số trực tiếp trên điểm             |
| `highlightMax` | `boolean`        | Đánh dấu điểm cao nhất                      |
| `fadeAnim`     | `Animated.Value` | (Tùy chọn) Truyền ref để làm hiệu ứng mờ    |
| `headerRight`  | `ReactNode`      | (Tùy chọn) Nhúng cục FilterTab vào góc phải |

**Cách dùng:**

```tsx
<BaseChart
    title="Thống kê chất lượng nước"
    data={[80, 82, 78, 85]}
    labels={["T2", "T3", "T4", "T5"]}
    smooth={true}
    highlightMax={true}
    lineColor="#00A89D"
/>
```

---

## 5. AlertBanner

Bảng cảnh báo nằm ngang (inline) trong luồng UI. Có hiệu ứng thu nhỏ và biến mất mượt mà.

**Import:**

```tsx
import AlertBanner from "@/components/ui/AlertBanner";
```

**Props:**

| Prop            | Kiểu dữ liệu                                                 | Mô tả                             |
| --------------- | ------------------------------------------------------------ | --------------------------------- |
| `visible`       | `boolean`                                                    | Ẩn/Hiện banner                    |
| `type`          | `"error"     \| "warning"                         \| "info"` | Quyết định màu sắc tự động        |
| `title`         | `string`                                                     | Tiêu đề lỗi                       |
| `message`       | `string`                                                     | Nội dung chi tiết                 |
| `dateText`      | `string`                                                     | (Tùy chọn) Chuỗi thời gian xảy ra |
| `onClose`       | `() => void`                                                 | Sự kiện khi bấm nút X             |
| `onPressDetail` | `() => void`                                                 | (Tùy chọn) Hiện nút "Chi tiết"    |

---

## 6. CustomToast

Thông báo thả xuống từ trên đỉnh màn hình (Overlay), chuyên dùng báo trạng thái "Thành công" hoặc "Lỗi". Nằm nổi trên mọi layout.

**Import:**

```tsx
import CustomToast from "@/components/ui/CustomToast";
```

**Props:**

| Prop       | Kiểu dữ liệu                                                                       | Mô tả                                                   |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `visible`  | `boolean`                                                                          | Trạng thái hiển thị                                     |
| `topInset` | `number`                                                                           | Khoảng cách an toàn đỉnh máy (dùng `useSafeAreaInsets`) |
| `message`  | `string`                                                                           | Dòng chữ thông báo                                      |
| `type`     | `"success"   \| "error"                                                 \| "info"` | Set màu tự động                                         |

---

## 7. CustomFilterTab

Thanh chuyển đổi các tùy chọn (ví dụ: Xem theo Ngày / Tháng / Năm).

**Import:**

```tsx
import CustomFilterTab from "@/components/ui/CustomFilterTab";
```

**Cách dùng:**

```tsx
const [filter, setFilter] = useState("day");

<CustomFilterTab
    options={[
        { label: "Ngày", value: "day" },
        { label: "Tháng", value: "month" },
    ]}
    activeOption={filter}
    onOptionChange={setFilter}
/>;
```

---

## 8. Skeleton (Loading)

Hiệu ứng nhấp nháy xám trong lúc chờ load API, code siêu ngắn gọn không cần xử lý Animation lặp lại.

**Import:**

```tsx
import { SkeletonContainer, SkeletonBlock } from "@/components/ui/Skeleton";
```

**Cách dùng:**

```tsx
// Bọc toàn bộ các khối Skeleton bằng Container
<SkeletonContainer style={{ gap: 20 }}>
    <SkeletonBlock style={{ height: 60, width: "100%" }} />
    <View style={{ flexDirection: "row", gap: 10 }}>
        <SkeletonBlock style={{ flex: 1, height: 80 }} />
        <SkeletonBlock style={{ flex: 1, height: 80 }} />
    </View>
</SkeletonContainer>
```
