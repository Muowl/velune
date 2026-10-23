#include <concepts>
#include <memory>
#include <string>
#include <string_view>
#include <vector>
#define VELUNE_VERSION "0.1"

namespace velune {

// Comments should remain readable and upright.
enum class ThemeMode { Dark, System };
struct Accent { unsigned char red, green, blue; };

template <typename T>
concept Named = requires(const T& value) {
    { value.name() } -> std::convertible_to<std::string_view>;
};

class Theme final {
public:
    explicit Theme(std::string name) : name_(name) {}
    [[nodiscard]] std::string_view name() const noexcept { return name_; }
    static constexpr int version = 1;
    ThemeMode mode = ThemeMode::Dark;
private:
    std::string name_;
};

template <Named T>
[[nodiscard]] std::string describe(const T& theme) {
    return std::string{theme.name()} + "\n";
}

using ThemePtr = std::unique_ptr<Theme>;
constexpr Accent accent{225, 76, 111};
constexpr auto metadata = R"json({"theme":"Velune","dark":true})json";

int preview() {
    ThemePtr theme = std::make_unique<Theme>("Velune");
    const auto label = describe(*theme);
    const auto version = VELUNE_VERSION;
    std::vector<int> levels{1, 2, 3};
    auto brighten = [](int value) -> int { return value + 1; };
    for (const auto& level : levels) {
        if (brighten(level) > 2 && theme->mode == ThemeMode::Dark) {
            return static_cast<int>(label.size() + version[0]);
        }
    }
    return 0;
}

#if 0
// Inactive regions are intentionally present for the editor review.
constexpr bool experimental = false;
#endif
} // namespace velune
